/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jboss.quickstarts.wfk.util;

import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.List;
import java.util.logging.Logger;

/**
 * <p>Handler object to convert {@link RestServiceException} exception into an actual {@link Response} containing JSON
 * so we can get a nice friendly error message, easily parsable by our API clients.</p>
 *
 * @author hugofirth
 */
@Provider
public class RestServiceExceptionHandler implements ExceptionMapper<RestServiceException> {

    @Inject
    private @Named("logger") Logger log;

    @Context
    private HttpHeaders headers;

    @Override
    public Response toResponse(final RestServiceException e) {

        log.severe("Mapping RestServiceException with status + \"" + e.getStatus() + "\", message: \"" + e.getMessage()
                + "\" and stack trace:" + System.getProperty("line.separator") + e.toString());

        Response.ResponseBuilder builder = Response.status(e.getStatus()).entity(new ErrorMessage(e.getMessage(), e.getReasons()));

        List<MediaType> accepts = headers.getAcceptableMediaTypes();
        if (accepts!=null && accepts.size() > 0) {
            //just pick the first one
            MediaType m = accepts.get(0);
            log.info("Setting response type to " + m);
            builder = builder.type(m);
        }
        else {
            //if not specified, use the entity type
            // set the response type to the entity type.
            builder = builder.type(headers.getMediaType());
        }
        return builder.build();
    }
}
